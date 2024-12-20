// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// Client is a middleman between the websocket connection and the hub.
type Client struct {
	UserID uuid.UUID
	Name   string
	hub    *Hub

	ScrollVerse int 

	// The websocket connection.
	conn *websocket.Conn

	// Buffered channel of outbound messages.
	send chan []byte
}

// readPump pumps messages from the websocket connection to the hub.
func (c *Client) readPump() {
	defer func() {
		// c.hub.addEvent(Event{Action: "leave", UUID: c.UserID})
		c.hub.unregister <- c
		c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1))

		var parse NewEvent
		err = json.NewDecoder(bytes.NewReader(message)).Decode(&parse)

		if err != nil {
			log.Println(err)
			continue
		}
		c.handleMessage(parse)
	}
}

func (c *Client) handleMessage(parse NewEvent) {
	if parse.Action == "scroll" {
		c.ScrollVerse = parse.VerseID
		return
	}
	event := Event{
		UUID:    c.UserID,
		Name:    c.Name,
		Action:  parse.Action,
		VerseID: parse.VerseID,
		Message: parse.Message,
	}
	c.hub.addEvent(event)
}

// writePump pumps messages from the hub to the websocket connection.
//
// A goroutine running writePump is started for each connection. The
// application ensures that there is at most one writer to a connection by
// executing all writes from this goroutine.
func (c *Client) writePump() { 
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			// Add queued chat messages to the current websocket message.
			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-c.send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// serveWs handles websocket requests from the peer.
func serveWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
	uuid := uuid.New()
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	// create client and register
	client := &Client{
		UserID: uuid,
		hub:    hub,
		Name:   r.FormValue("name"),
		conn:   conn,
		ScrollVerse: 0,
		send:   make(chan []byte, 256)}

	client.hub.register <- client

	// add and broadcast join event
	// client.hub.addEvent(Event{
	// 	UUID:    uuid,
	// 	name:    client.Name,
	// 	Action:  "join",
	// 	VerseID: 0,
	// 	Message: client.Name,
	// })

	// send join message back to client, with event state
	joinMsg := Response{
		Action: "subscribe",
		Msg:    uuid.String(),
		Body:   hub.getAllEvents(),
	}

	parsedResponse, err := json.Marshal(joinMsg)

	if err != nil {
		log.Println(err)
	}

	client.send <- []byte(parsedResponse)

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.writePump()
	go client.readPump()
}

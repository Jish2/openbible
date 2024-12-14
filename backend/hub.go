// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import (
	"encoding/json"
	"fmt"
	"sync"
	"time"
)

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	mu sync.Mutex
	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the clients.
	broadcast chan []byte

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client

	events []Event
}

func (h *Hub) getAllEvents() []Event {
	return h.events
}

func (h *Hub) addEvent(event Event) {
	h.mu.Lock()
	h.events = append(h.events, event)
	h.mu.Unlock()
	h.broadcastEvent(event)
}

func (hub *Hub) broadcastEvent(event Event) {
	parsedResponse, err := json.Marshal(event)
	if err != nil {
		fmt.Println(err)
	}
	hub.broadcast <- []byte(parsedResponse)
}

func (hub *Hub) publishScrollPositions() {
	var positions []*ScrollPosition

	for client := range hub.clients {
		curPos := ScrollPosition{
			UserID: client.UserID,
			VerseID: client.ScrollVerse,
		}
		positions = append(positions, &curPos)
	}

	message := Response{
		Action: "positions",
		Body: positions,
	}

	parsedResponse, err := json.Marshal(message)
	if err != nil {
		fmt.Println(err)
	}
	hub.broadcast <- []byte(parsedResponse)
}

func newHub() *Hub {
	return &Hub{
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

func (h *Hub) tick(ticker *time.Ticker) {
	for range ticker.C {
		h.publishScrollPositions()
	}
}


func (h *Hub) run() {
	ticker := time.NewTicker(500 * time.Millisecond)
	go h.tick(ticker)

	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
		case message := <-h.broadcast:
			for client := range h.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
		}
	}
}

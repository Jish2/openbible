package main

import "github.com/google/uuid"

type User struct {
	Username          string
	VersePosition     int
	SelectedVerseUUID uuid.UUID
}

type Response struct {
	Action string
	Msg    string
	Body   any
}

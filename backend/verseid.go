package main

import "github.com/google/uuid"

type NewEvent struct {
	Action  string
	VerseID int
	Message string
}

type Event struct {
	UUID    uuid.UUID
	Action  string
	VerseID int
	Message string
}

package main

import "github.com/google/uuid"


type Event struct {
	UUID	uuid.UUID
	Action  string
	VerseID int
	Message string
}
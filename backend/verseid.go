package main

import "github.com/google/uuid"

type VerseID struct {
	Map value
}

type value struct {
	Comments []struct {
		UUID uuid.UUID
		Text string
	}
	Highlights []uuid.UUID
}

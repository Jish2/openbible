FROM golang:latest as build

# Set working directory inside container
WORKDIR /app/backene

# Copy Go module files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code files
COPY *.go ./

# Build the Go application for a Linux target
RUN CGO_ENABLED=0 GOOS=linux go build -o /docker-gs-ping

# Expose port 8080 for the application
EXPOSE 8080

# Set the default command to run the Go binary
CMD ["/docker-gs-ping"]

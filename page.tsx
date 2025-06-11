"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { Button, Container, Navbar, Spinner } from "react-bootstrap";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column vh-100">
      <Navbar bg="dark" variant="dark" fixed="top">
        <Container>
          <Navbar.Brand>ChatGPT Mobile</Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            {user ? (
              <Button href="/api/auth/logout" variant="outline-light">
                Logout
              </Button>
            ) : (
              <Button href="/api/auth/login" variant="outline-light">
                Login
              </Button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="flex-grow-1" style={{ marginTop: "56px", marginBottom: "56px" }}>
        {user ? <ChatInterface /> : (
          <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
            <h4>Please login to start chatting</h4>
          </Container>
        )}
      </main>
    </div>
  );
}

package main

import (
	"net/http"
)

// Handles the CORS Same origin and preflight requests.
func (app *application) enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Add the "Vary: Origin" Header
		w.Header().Add("Vary", "Origin")

		// Add the "Vary: Access-Control-Request-Method" for preflight requests
		w.Header().Add("Vary", "Access-Control-Request-Method")

		// Get the requests Origin header
		origin := r.Header.Get("Origin")

		if origin != "" {
			// Loop through the trusted origin headers to see if it matches this requests origin
			for i := range app.config.cors.trustedOrigins {
				if origin == app.config.cors.trustedOrigins[i] {
					w.Header().Set("Access-Control-Allow-Origin", origin)

					// Check to see if its has the HTTP method OPTIONS and contains the
					// Access-Control-Request-Method header. If so treat as a prelight request.
					if r.Method == http.MethodOptions && r.Header.Get("Access-Control-Request-Method") != "" {
						// Set the necessary preflight response headers
						w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, PUT, PATCH, DELETE")
						w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")

						// If OPTION request we dont want to carry on so write the headers and return
						// So no further middleware chaining runs
						w.WriteHeader(http.StatusOK)
						return
					}
					break
				}
			}
		}

		next.ServeHTTP(w, r)
	})
}

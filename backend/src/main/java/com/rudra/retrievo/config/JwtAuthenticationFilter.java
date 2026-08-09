package com.rudra.retrievo.config;

import com.rudra.retrievo.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component // Tells Spring to manage this class as a Bean
@RequiredArgsConstructor // Lombok generates a constructor for our final fields
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService; // We will configure this bean in Step 3

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Read the HTTP header "Authorization" from incoming request
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 2. If the header is missing or doesn't start with "Bearer ", skip this check
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response); // Proceed to the next filter
            return;
        }

        // 3. Extract the token string (skip "Bearer " which has 7 characters)
        jwt = authHeader.substring(7);
        userEmail = jwtService.extractEmail(jwt); // Extract the email from the token

        // 4. If we found an email, and the user is not logged into Spring Security context yet
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Load user data from PostgreSQL database
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // 5. Mathematically verify if the token is valid for this user
            if (jwtService.isTokenValid(jwt, (com.rudra.retrievo.entity.User) userDetails)) {
                // Create an authentication object that Spring Security understands
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 6. Log the user in to Spring Security's context memory!
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 7. Proceed to the next filter in the chain
        filterChain.doFilter(request, response);
    }
}

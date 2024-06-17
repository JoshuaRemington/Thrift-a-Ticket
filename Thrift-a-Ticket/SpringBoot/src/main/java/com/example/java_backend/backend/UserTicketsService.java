package com.example.java_backend.backend;

import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import com.example.java_backend.backend.UserTicketsRepository;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import com.mashape.unirest.http.exceptions.UnirestException;

@Service
public class UserTicketsService {
    
  @Autowired
  private UserTicketsRepository userTicketsRepository;

  @Transactional
  public UserTickets saveUserConcert(UserTickets userTickets) {
    try {
      return userTicketsRepository.save(userTickets);
    } catch (Exception e) {
        // Print the error message or handle the exception as needed
        System.err.println("Error occurred while saving user: " + e.getMessage());
        // You can also throw a custom exception or return a specific response if required
        throw new RuntimeException("Error occurred while saving user", e);
    }
  }

  public List<UserTickets> callAPIService(String user_event_name, String user_state_initials) {
        List<UserTickets> list = (List<UserTickets>) ticketAPIMain.callAPI(user_event_name, user_state_initials);
        return list;
    }

  public Iterable<UserTickets> findAll() {
    return userTicketsRepository.findAll();
  }

  public Iterable<UserTickets> findAllByEmail(String email) {
    return userTicketsRepository.findByEmail(email);
  }
}

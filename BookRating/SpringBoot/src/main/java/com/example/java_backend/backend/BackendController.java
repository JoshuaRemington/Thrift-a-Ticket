package com.example.java_backend.backend;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.java_backend.backend.User;
import com.mashape.unirest.http.exceptions.UnirestException;

@RestController // This means that this class is a Controller
public class BackendController {
  
  @Autowired
  private final UserService userService;

  @Autowired
  private final UserBooksService userTicketsService;

  @Autowired
  private final BookAPI api;

  @Autowired
  public BackendController(UserService userService, UserBooksService userTicketsService, BookAPI api) {
    this.userService = userService;
    this.userTicketsService = userTicketsService;
    this.api = api;
  }

  @PostMapping(path="/addUser")
  public @ResponseBody int addNewUser(@RequestBody User u) {
      String encryptedPassword = BCrypt.hashpw(u.getPassword(), BCrypt.gensalt());
      User n = new User(u.getEmail(), encryptedPassword);
      try {
          User savedUser = userService.saveUser(n);
          if (savedUser == null) {
              // User already exists
              return 0;
          } else {
              // User saved successfully
              return 2;
          }
      } catch (Exception e) {
          // Error occurred while saving user
          System.err.println("Error occurred while adding user: " + e.getMessage());
          e.printStackTrace();
          return 1;
      }
  }

  @PostMapping(path="/login")
  public @ResponseBody boolean login (@RequestBody User u) {
    String encryptedPassword = BCrypt.hashpw(u.getPassword(), BCrypt.gensalt());
    User n = new User(u.getEmail(), encryptedPassword);
    return userService.inDatabase(n);
  }

  @PostMapping(path="/addUserTicket") // Map ONLY POST Requests
  public @ResponseBody String addNewUserTicket(@RequestBody UserBooks request) {
      // @ResponseBody means the returned String is the response, not a view name
      // @RequestBody binds the JSON data to the UserTicketRequest object
      UserBooks n = new UserBooks(request.getEmail(), request.getArtist(), request.getVenue(),
              request.getDate(), request.getTime(), request.getPrice(), request.getPurchase_link(), request.getImg_url());
      userTicketsService.saveUserConcert(n);
      return "Saved";
  }
  
  @GetMapping(path="/searchTickets/{event}/{state_letters}")
  public @ResponseBody Iterable<UserBooks> apiSearch(@PathVariable String event, @PathVariable String state_letters) {
    return userTicketsService.callAPIService(event, state_letters);
  }

  @GetMapping(path="/searchTickets")
  public @ResponseBody Iterable<User> searchTickets() {
    // This returns a JSON or XML with the users
    return userService.findAll();
  }

  @GetMapping(path="/all")
  public @ResponseBody Iterable<User> getAllUsers() {
    // This returns a JSON or XML with the users
    return userService.findAll();
  }

  @GetMapping(path="/allUserTickets")
  public @ResponseBody Iterable<UserBooks> getAllUserTickets() {
    // This returns a JSON or XML with the user tickets
    return userTicketsService.findAll();
  }

  @GetMapping("/UserBooks/{email}")
    public @ResponseBody Iterable<UserBooks> getUserTickets(@PathVariable String email) {
    // This returns a JSON or XML with the user concerts
    return userTicketsService.findAllByEmail(email);
  }

}

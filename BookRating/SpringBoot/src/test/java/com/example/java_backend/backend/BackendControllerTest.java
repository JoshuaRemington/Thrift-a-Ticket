package com.example.java_backend.backend;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Collections;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(BackendController.class)
public class BackendControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private UserBooksService userBooksService;

    @MockBean
    private BookAPI api;

    private User user;
    private UserBooks UserBooks;

    @BeforeEach
    void setUp() {
        user = new User("test@example.com", "password");
        UserBooks = new UserBooks("test@example.com", "artist", "venue", "date", "time", "price", "link", "img");
    }

    @Test
    public void testAddNewUser() throws Exception {
        when(userService.saveUser(any(User.class))).thenReturn(user);

        mockMvc.perform(post("/addUser")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(content().string("2"));
    }

    @Test
    public void testLogin() throws Exception {
        when(userService.inDatabase(any(User.class))).thenReturn(true);

        mockMvc.perform(post("/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    public void testAddNewUserTicket() throws Exception {
        mockMvc.perform(post("/addUserTicket")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(UserBooks)))
                .andExpect(status().isOk())
                .andExpect(content().string("Saved"));
    }

    @Test
    public void testApiSearch() throws Exception {
        when(userBooksService.callAPIService(anyString(), anyString())).thenReturn(Collections.singletonList(UserBooks));

        mockMvc.perform(get("/searchTickets/event/state"))
                .andExpect(status().isOk())
                .andExpect(content().json(new ObjectMapper().writeValueAsString(Collections.singletonList(UserBooks))));
    }

    @Test
    public void testGetAllUsers() throws Exception {
        when(userService.findAll()).thenReturn(Collections.singletonList(user));

        mockMvc.perform(get("/all"))
                .andExpect(status().isOk())
                .andExpect(content().json(new ObjectMapper().writeValueAsString(Collections.singletonList(user))));
    }

    @Test
    public void testGetAllUserTickets() throws Exception {
        when(userBooksService.findAll()).thenReturn(Collections.singletonList(UserBooks));

        mockMvc.perform(get("/allUserTickets"))
                .andExpect(status().isOk())
                .andExpect(content().json(new ObjectMapper().writeValueAsString(Collections.singletonList(UserBooks))));
    }

    @Test
    public void testGetUserTickets() throws Exception {
        when(userBooksService.findAllByEmail(anyString())).thenReturn(Collections.singletonList(UserBooks));

        mockMvc.perform(get("/UserBooks/test@example.com"))
                .andExpect(status().isOk())
                .andExpect(content().json(new ObjectMapper().writeValueAsString(Collections.singletonList(UserBooks))));
    }
}
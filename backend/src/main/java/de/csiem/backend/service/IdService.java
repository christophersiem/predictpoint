package de.csiem.backend.service;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class IdService {

    public String createUUID() {
        return UUID.randomUUID().toString();
    }
}

package com.krayon.backend.exception;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class DuplicatedUserIdException extends RuntimeException {
    public DuplicatedUserIdException(String message) {
        super(message);
    }
}

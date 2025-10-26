package de.csiem.backend.model;
public enum Status {
    OPEN,
    PENDING,
    FINISHED;

    public boolean isTippable() {
        return this == OPEN;
    }

}

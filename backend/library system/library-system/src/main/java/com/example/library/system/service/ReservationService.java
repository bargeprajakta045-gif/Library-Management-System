package com.example.library.system.service;

import com.example.library.system.entity.Reservation;

import java.util.List;

public interface ReservationService {

    Reservation createReservation(Long bookId, Long memberId);

    Reservation getReservationById(Long id);

    List<Reservation> getAllReservations();

    List<Reservation> getReservationsByMember(Long memberId);

    void deleteReservation(Long id);
}

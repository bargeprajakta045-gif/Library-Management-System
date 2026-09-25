package com.example.library.system.controller;

import com.example.library.system.entity.Reservation;
import com.example.library.system.service.ReservationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(
            ReservationService reservationService) {

        this.reservationService = reservationService;
    }

    @PostMapping
    public ResponseEntity<Reservation> createReservation(
            @RequestBody Map<String, Long> data) {

        Long bookId = data.get("bookId");
        Long memberId = data.get("memberId");

        return ResponseEntity.ok(
                reservationService.createReservation(
                        bookId,
                        memberId
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<Reservation>>
    getAllReservations() {

        return ResponseEntity.ok(
                reservationService.getAllReservations()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                reservationService.getReservationById(id)
        );
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Reservation>>
    getReservationsByMember(
            @PathVariable Long memberId) {

        return ResponseEntity.ok(
                reservationService.getReservationsByMember(
                        memberId
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReservation(
            @PathVariable Long id) {

        reservationService.deleteReservation(id);

        return ResponseEntity.ok(
                "Reservation deleted successfully"
        );
    }
}
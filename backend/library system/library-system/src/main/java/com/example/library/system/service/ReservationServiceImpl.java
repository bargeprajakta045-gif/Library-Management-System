package com.example.library.system.service;

import com.example.library.system.entity.Book;
import com.example.library.system.entity.Member;
import com.example.library.system.entity.Reservation;
import com.example.library.system.exception.BadRequestException;
import com.example.library.system.exception.ResourceNotFoundException;
import com.example.library.system.repository.BookRepository;
import com.example.library.system.repository.MemberRepository;
import com.example.library.system.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;

    public ReservationServiceImpl(
            ReservationRepository reservationRepository,
            BookRepository bookRepository,
            MemberRepository memberRepository) {

        this.reservationRepository = reservationRepository;
        this.bookRepository = bookRepository;
        this.memberRepository = memberRepository;
    }

    @Override
    public Reservation createReservation(
            Long bookId,
            Long memberId) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Book not found"
                        ));

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Member not found"
                        ));

        if (book.getAvailableQuantity() > 0) {
            throw new BadRequestException(
                    "Book is currently available. You can issue it directly."
            );
        }

        Reservation reservation = new Reservation();

        reservation.setBook(book);
        reservation.setMember(member);
        reservation.setReservationDate(LocalDate.now());
        reservation.setStatus("PENDING");

        return reservationRepository.save(reservation);
    }

    @Override
    public Reservation getReservationById(Long id) {

        return reservationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Reservation not found"
                        ));
    }

    @Override
    public List<Reservation> getAllReservations() {

        return reservationRepository.findAll();
    }

    @Override
    public List<Reservation> getReservationsByMember(
            Long memberId) {

        return reservationRepository.findByMemberId(memberId);
    }

    @Override
    public void deleteReservation(Long id) {

        Reservation reservation = getReservationById(id);

        reservationRepository.delete(reservation);
    }
}
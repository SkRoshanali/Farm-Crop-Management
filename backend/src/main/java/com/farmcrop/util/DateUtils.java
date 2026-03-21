package com.farmcrop.util;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
public final class DateUtils {
    private DateUtils() {}

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public static String format(LocalDate date) {
        return date == null ? null : date.format(FORMATTER);
    }

    public static LocalDate parse(String dateStr) {
        return dateStr == null ? null : LocalDate.parse(dateStr, FORMATTER);
    }
}

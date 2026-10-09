#target illustrator

var applicationLocale = "unavailable";

try {
    applicationLocale = app.locale;
} catch (error) {
    applicationLocale = "not exposed by this Illustrator version";
}

alert(
    "Ai Command Palette locale check\n\n" +
        "$.locale = " +
        $.locale +
        "\napp.locale = " +
        applicationLocale
);

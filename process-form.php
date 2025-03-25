<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Email address where form submissions should be sent
    $recipient_email = "info@casadesolaz.com";
    
    // Collect form data
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = trim($_POST["phone"]);
    $event_date = trim($_POST["event-date"]);
    $event_type = trim($_POST["event-type"]);
    $guests = trim($_POST["guests"]);
    $message = trim($_POST["message"]);
    
    // Set email subject
    $subject = "New Contact Form Submission: $event_type Event";
    
    // Build the email content
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Phone: $phone\n";
    $email_content .= "Event Date: $event_date\n";
    $email_content .= "Event Type: $event_type\n";
    $email_content .= "Guest Count: $guests\n\n";
    $email_content .= "Message:\n$message\n";
    
    // Build the email headers
    $email_headers = "From: $name <$email>";
    
    // Send the email
    mail($recipient_email, $subject, $email_content, $email_headers);
    
    // Return success response for AJAX requests
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success']);
    
} else {
    // Not a POST request, redirect to contact page
    header("Location: contact.html");
}
?>
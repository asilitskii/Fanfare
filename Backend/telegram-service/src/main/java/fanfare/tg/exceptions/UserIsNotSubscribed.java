package fanfare.tg.exceptions;

public class UserIsNotSubscribed extends RuntimeException {
  public UserIsNotSubscribed(String message) {
    super(message);
  }
}

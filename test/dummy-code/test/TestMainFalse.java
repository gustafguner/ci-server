// To compile javac -cp /usr/share/java/junit4-4.12.jar TestMainTrue.java MainSuccess.java
// To run test: java -cp /usr/share/java/junit4-4.12.jar org.junit.runner.JUnitCore TestMainFalse

import static org.junit.Assert.*;

import org.junit.Test;

public class TestMainFalse {

  @Test
  public void testThatIsFalse () {
    MainSuccess main = new MainSuccess();
    assertEquals(main.max(1, 0), 0);
  }

}

// To compile: javac -cp /usr/share/java/junit4-4.12.jar TestMainTrue.java MainSuccess.java
// To run test: java -cp /usr/share/java/junit4-4.12.jar org.junit.runner.JUnitCore TestMainTrue

import static org.junit.Assert.*;

import org.junit.Test;

public class TestMainTrue {

  @Test
  public void testThatIsTrue(){
    MainSuccess main = new MainSuccess();
    assertEquals(main.max(1, 0), 1);
  }
}



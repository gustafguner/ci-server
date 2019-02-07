import static org.junit.Assert.*;
import org.junit.Test;

public class TestMainTrue {
	@Test
	public void testThatIsTrue() {
		Main main = new Main();
		assertEquals(main.max(1, 0), 1);
	}
}

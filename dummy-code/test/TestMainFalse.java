import static org.junit.Assert.*;
import org.junit.Test;

public class TestMainFalse {
	@Test
	public void testThatIsFalse() {
		Main main = new Main();
		assertEquals(main.max(1, 0), 0);
	}
}

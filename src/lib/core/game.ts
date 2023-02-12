import TinaCore from ".";

class TinaGame {
	/** @server */
	public shutdown(): TinaCore {
		return new TinaCore();
	}
}

export default TinaGame;

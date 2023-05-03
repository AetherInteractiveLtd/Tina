import { LocalState } from ".";

export = (): void => {
    describe("localState should",() => {
        interface LocalStateTest {
            test: string,
            test2: number
        }
        let state: LocalState<LocalStateTest>;
        it("be creatable with an object",() => {
            state = new LocalState<LocalStateTest>({
                test: "test",
                test2: 2
            });

            expect(state).to.be.ok();
        });

        it("have the correct state values when created", () => {
            expect(state.get().test).to.equal("test");
            expect(state.get().test2).to.equal(2);
        });

        it("set the correct values when modified",() => {
            state.set({test: "Hello World!"});
            expect(state.get().test).to.equal("Hello World!");

            state.set({test: "Goodbye World!"});
            state.set({test2: 20});
            expect(state.get().test).to.equal("Goodbye World!");
            expect(state.get().test2).to.equal(20);
            
            state.set({
                test: "Welcome",
                test2: 10
            });
            expect(state.get().test).to.equal("Welcome");
            expect(state.get().test2).to.equal(10);
        });

        let dataUpdated = false;

        it("propogate state changes to subcribed callbacks",() => {
            state.subscribe().do(newState => {
                dataUpdated = newState.test2 === 200;
            });

            state.set({test2: 200});
            wait(0.5);
            expect(dataUpdated).to.equal(true);
        });
    });
}
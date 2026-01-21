import Reactotron from "reactotron-react-native";
import { QueryClientManager, reactotronReactQuery } from "reactotron-react-query";
import { queryClient } from "./queryClient";

if (__DEV__) {
	const queryClientManager = new QueryClientManager({
		// @ts-ignore - a tipagem pode estar desalinhada entre react-query v5 e reactotron-react-query
		queryClient,
	});

	Reactotron.configure({
		name: "Monvo",
	})
		.useReactNative({})
		.use(reactotronReactQuery(queryClientManager))
		.connect();

	Reactotron.clear();

	// @ts-ignore
	console.tron = Reactotron;
}

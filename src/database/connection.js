import { openDatabase } from "react-native-sqlite-storage";
const Connection = () => {
    return openDatabase({
        name: "SRP",
    });
};

export default Connection;
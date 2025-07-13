import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/Home.tsx";
import TableView from "./components/TableView.tsx";
import {Toaster} from "react-hot-toast";

const App = () => {
    return (
        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        fontSize: "1.3rem",
                        maxWidth: "500px"
                    }
                }}
            />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/table" element={<TableView/>}/>
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;
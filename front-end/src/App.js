import "./App.css";
//  import
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//  importer les composants
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";

function App() {
    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>

                <Footer />
            </div>
        </Router>
    );
}

export default App;

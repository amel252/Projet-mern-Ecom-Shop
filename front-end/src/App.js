import "./App.css";
//  import
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
//  importer les composants
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";

function App() {
    return (
        <Router>
            <div className="App">
                <Toaster />
                {/* la position par default est a droite en haut  */}
                <Header position="top-center" />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                </Routes>

                <Footer />
            </div>
        </Router>
    );
}

export default App;

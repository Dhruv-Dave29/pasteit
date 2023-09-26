import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import PasteIt from "./components/pasteit";


function App() {
  return (
    <Router>
      {/* <div className="App deep-purple lighten-5">
        <Header/>
        <main className="container"> */}
          <Routes>
          <Route path="/*" exact element={<PasteIt />}>
              
            </Route>
            <Route path="/:nan_id" element={<PasteIt />}>
            
            </Route>
          </Routes>
        {/* </main>
      </div> */}
    </Router>
  );
}

export default App;

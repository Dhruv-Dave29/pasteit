import axios from "axios";


import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "codemirror";
import {tokyoNight} from "@uiw/codemirror-theme-tokyo-night";
import { darcula } from "@uiw/codemirror-theme-darcula";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";

import { useNavigate, useParams } from "react-router-dom";
import { customAlphabet } from "nanoid";
import React , { useState, useCallback, useRef, useEffect, } from "react";

import { loadLanguage } from '@uiw/codemirror-extensions-langs';

import { ASCII_404 } from "./404text.js";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 8);


console.log(ASCII_404);

const PasteIt = () => {
  /*for toggle-able menu */
  const [isOptionsVisible, setOptionsVisible] = useState(false);

  /*end of toggleable menu */

      /*fetch data start*/
      const [paste, setPaste] = useState({
        nan_id: "",
        paste: "",
        title: "",
        expireAt: Date.now(),
        createdAt: Date.now(),
        language: "",
      });
    
      const {nan_id} = useParams();
    
      useEffect(() => {
        if (nan_id) {
          axios.get(`http://localhost:3000/get/${nan_id}`).then((res) => {
            console.log("Fetched data:", res.data)
            if (res.data) {
              setPaste(res.data);
            } else {
              setPaste({
                nan_id: nan_id,
                paste: ASCII_404,
                title: '',
                expireAt: Date.now(),
                createdAt: Date.now(),
                language: "",
              })};
          }).catch((error) => {
            console.error("Error fetching data:", error); // Log any errors that occur
          });
        }
      }, [nan_id]);
      /*fetch data end*/
  
  const [title, setTitle] = useState('');
  const [timeout, setTimeout] = useState('0');
  const [pasteID, setPasteID] = useState(nanoid());
  const [pasteContent, setPasteContent] = useState("");


  const [languageMode, setLanguageMode] = useState("");
  const [theme,setTheme] = useState(localStorage.getItem('theme') || "githubDark");

/*to change the save button text */
  const [saveText,setSaveText]=useState("save");


 


  const onChange = useCallback((value, viewUpdate) => {
    setPasteContent(value);
    setSaveText("save");
  }, []);

  let navigate = useNavigate();



  const submitPaste = () => {
    // console.log(title, pasteContent, timeout, pasteID);

    let exp_date;

    if (timeout > 0) {
      exp_date = new Date(Date.now() + timeout * 60 * 1000);
    } else {
      // if null then never expire
      exp_date = null;
    }
    if (pasteContent !== "") {
      if(paste.paste===pasteContent || paste.paste===nan_id){
        navigator.clipboard.writeText(`http://localhost:5000/${nan_id}`);
        setSaveText("link copied!");
        return;
      }
      setSaveText("saving...");
      axios
        .post("http://localhost:3000/add", {
          nan_id: pasteID,
          title: title,
          paste: pasteContent,
          expireAt: exp_date,
          language: languageMode,
        })
        .then(() => {
          const redir = "/" + pasteID;
          navigator.clipboard.writeText(`http://localhost:5000/${pasteID}`);
          setSaveText("link copied!");
          setPasteID(nanoid());

          // Redirect
          navigate(redir);
        })
        .catch((err) => {
          if (err.response) {
            setSaveText("save");
            if (err.response.data === "pasteid-exists") {
              console.log("paste id existslol");
            } else {
              console.log("other error");
            }
          }
        });}
      else{
        console.log("cannot post empty paste!");
      }
  }

  const viewRef = useRef();
  const eraseText = () =>{
    
      viewRef.current.view.dispatch({
        changes: { from: 0, to: viewRef.current.view.state.doc.length, insert: ""}
      });
      navigate('/');
  };

  const handleLanguageChange = (event) => {
    const selectedMode = event.target.value;
    setLanguageMode(selectedMode);
  };

  const handleThemeChange = (event) => {
    const selectedTheme = event.target.value;
    setTheme(selectedTheme);
    localStorage.setItem('theme', selectedTheme);
  };
/*to remember the theme user selected */
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

/*to remember the paste language */
useEffect(() => {
  setLanguageMode(paste.language);
  setPasteContent(paste.paste);
}, [paste.language,paste.paste]);




  return (
    <div className="playground-container">

        <nav>
          <div className="navbar-left">
            <button onClick={eraseText}>[new]</button>
            <button onClick={submitPaste} disabled={saveText === "link copied!"} >[{saveText}]</button>
            <select value={languageMode} onChange={handleLanguageChange}>
              <option value="">plain</option>
              <option value="cpp">c++</option>
              <option value="javascript">javacript</option>
              <option value="python">python</option>
            </select>
          </div>
            
          <div className="navbar-right">
            <button onClick={() => setOptionsVisible(!isOptionsVisible)}>[options]</button>
            <select value={theme} onChange={handleThemeChange}>
              <option value="githubDark">githubDark</option>
              <option value="githubLight">githubLight</option>
              <option value="darcula">darcula</option>
              <option value="tokyoNight">tokyoNight</option>
            </select>
            <button className="about" href="#">[about]</button>
          </div>
        </nav>
        
        <div className="playground-panel">
        <div className={`wrapper ${isOptionsVisible ? "visible" : ""}`}>
            <div className="input-pairs">

                <label htmlFor="title">Title :</label>

                <input name="title" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

            </div>


            <div className="input-pairs">

                <label htmlFor="customid">Custom ID :</label>

                <input name="customid" type="text" placeholder="Paste Link" value={pasteID} onChange={(e) => setPasteID(e.target.value)} />

            </div>

            <div className="input-pairs">

                <label htmlFor="expiry">Expiry :</label>

                <input name="expiry" type="number" placeholder="Timeout in minutes" value={timeout} onChange={(e) => setTimeout(e.target.value)} />
            
            </div>
        </div>
        <CodeMirror
            className="cm-outer-container"
            ref={viewRef}
            theme={theme === 'githubDark' ? githubDark :
            theme === 'githubLight' ? githubLight :
            theme === 'darcula' ? darcula :
            theme === 'tokyoNight' ? tokyoNight : ''}

            value={pasteContent}
            
            extensions={[loadLanguage(languageMode),
              EditorView.lineWrapping,
              EditorView.theme({
                '&': {
                  fontSize : "18px"
                },
                "&.cm-editor.cm-focused": {
                  outline: "none"
              }
                
              })
            ].filter(Boolean)}
            basicSetup={{
              highlightActiveLine : false,
              highlightActiveLineGutter : false,
            }}
            onChange={onChange}
          />
        
      </div>
    </div>
  );
}

export default PasteIt;


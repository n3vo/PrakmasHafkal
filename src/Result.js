import React, { useState } from "react";
import Confetti from "react-confetti";
import Swal from "sweetalert2";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { useData } from "./DataContext";
import { MainContainer } from "./components/MainContainer";
import { PrimaryButton } from "./components/PrimaryButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InsertDriveFile from "@material-ui/icons/InsertDriveFile";
import { collection, addDoc, setDoc, doc, where, getDocs, query } from "firebase/firestore";
import { db } from "./firebase-config"


const useStyles = makeStyles({
  root: {
    marginBottom: "30px",
  },
  table: {
    marginBottom: "30px",
  },
});

export const Result = () => {
  const [success, setSuccess] = useState(false);
  const styles = useStyles();
  const { data } = useData();
  const entries = Object.entries(data).filter((entry) => entry[0] !== "files");
  const { files } = data;
  const collectionRef = collection(db, "Members")

  const onSubmit = async () => {
    const formData = new FormData();
    if (data.files) {
      data.files.forEach((file) => {
        formData.append("files", file, file.name);
      });
    }
    entries.forEach((entry) => {
      formData.append(entry[0], entry[1]);
    });

    var object = {};

    formData.forEach(function (value, key) {
      object[key] = value;
    });

    var objIndex = Object.values(object);
    var keyIndex = Object.keys(object).indexOf('personalID');
    let dupValue = objIndex[keyIndex];

    const q = query(collectionRef, where("personalID", "==", dupValue));
    const querySnapshot = await getDocs(q);
    let a = true;
    querySnapshot.forEach((doc1) => {
      console.log(doc1.id, " => ", doc1.data());
      setDoc(doc(collectionRef, doc1.id), object);
      a = false;
      Swal.fire({
        icon: "success",
        title: "!מעולה",
        text: "!הפרטים שלך נקלטו במערכת",
        confirmButtonText: "אוקיי"
      });
      setSuccess(true);
    });
    if (a) { await addDoc(collectionRef, object); }
    
 /*    const res = await fetch("http://localhost:4000/", {
      method: "POST",
      body: formData,
    });

    if (res.status === 200) {
     
    } */
  };
  if (success) {
    return <Confetti />;}
/*   
  }
 */ 
  return (
    <>
      <MainContainer>
        <Typography component="h2" variant="h5">
          רגע לפני ששולחים
        </Typography>
        <TableContainer className={styles.root} component={Paper}>
          <Table className={styles.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>קטגורייה</TableCell>
                <TableCell align="right">נתונים</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry[0]}>
                  <TableCell component="th" scope="row">
                    {entry[0]}
                  </TableCell>
                  <TableCell align="right">{entry[1].toString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {files && (
          <>
            <Typography component="h2" variant="h5">
              קבצים
            </Typography>
            <List>
              {files.map((f, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <InsertDriveFile />
                  </ListItemIcon>
                  <ListItemText primary={f.name} secondary={f.size} />
                </ListItem>
              ))}
            </List>
          </>
        )}
        <PrimaryButton onClick={onSubmit}>שלח</PrimaryButton>
        <Link to="/">התחל מחדש</Link>
      </MainContainer>
    </>
  );
};

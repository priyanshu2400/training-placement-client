import React, { useState, useEffect } from "react";
import {
  Grid,
  Container,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import Announcement from "../components/Announcement";
import axios from "axios";
import { useSelector } from "react-redux";
import Layout from "../layout/Layout";
import dayjs from "dayjs"; // Importing dayjs for date formatting

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const backendServer = process.env.REACT_APP_BACKEND_SERVER || 'http://localhost:3001';
  const role = useSelector((state) => state.user.role);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    description: "",
  });

  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${backendServer}/announcements`);
        // Map over announcements to add formatted timestamp using dayjs
        const formattedAnnouncements = response.data.map(announcement => ({
          ...announcement,
          formattedTimestamp: dayjs(announcement.timestamp).format('MMMM D, YYYY h:mm A')
        }));
        setAnnouncements(formattedAnnouncements);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };
    fetchAnnouncements();
  }, [backendServer]);

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    const announcementWithTimestamp = {
      ...newAnnouncement,
      timestamp: new Date().toISOString(), // Add timestamp
    };
    try {
      const response = await axios.post(`${backendServer}/announcements`, announcementWithTimestamp);
      setAnnouncements([{
        ...response.data,
        formattedTimestamp: dayjs(response.data.timestamp).format('MMMM D, YYYY h:mm A')
      }, ...announcements]);
      setNewAnnouncement({ title: "", description: "" });
    } catch (error) {
      console.error('Error adding announcement:', error);
    }
  };

  const removeAnnouncement = async (id) => {
    try {
      await axios.delete(`${backendServer}/announcements/${id}`);
      setAnnouncements(announcements.filter((announcement) => announcement._id !== id));
    } catch (error) {
      console.error('Error removing announcement:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Layout>
      <Container>
        {role === 'Admin' && (
          <Grid container justifyContent="center" sx={{ marginBottom: 2 }}>
            <Tabs value={tabIndex} onChange={handleTabChange} centered>
              <Tab label="Add Announcement" />
              <Tab label="Show Announcements" />
            </Tabs>
          </Grid>
        )}
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {role === 'Admin' && tabIndex === 0 && (
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ fontSize: '1.25rem' }}>
                  Add Announcement
                </Typography>
                <form onSubmit={handleAnnouncementSubmit}>
                  <TextField
                    label="Title"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    fullWidth
                    margin="normal"
                    InputProps={{ sx: { fontSize: '0.875rem' } }}
                    InputLabelProps={{ sx: { fontSize: '0.875rem' } }}
                  />
                  <TextField
                    label="Description"
                    multiline
                    value={newAnnouncement.description}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
                    fullWidth
                    margin="normal"
                    InputProps={{ sx: { fontSize: '0.875rem' } }}
                    InputLabelProps={{ sx: { fontSize: '0.875rem' } }}
                  />
                  <Button type="submit" variant="contained" color="primary">
                    Add Announcement
                  </Button>
                </form>
              </Paper>
            </Grid>
          )}
          {(tabIndex === 1 || role !== 'Admin') && (
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ padding: 2, background: "#f0f0f0" }}>
                <Typography variant="h5" gutterBottom sx={{ fontSize: '1.25rem' }}>
                  Announcements
                </Typography>
                <Box
                  sx={{
                    maxHeight: 400,
                    overflowY: "auto",
                    "&::-webkit-scrollbar": { display: "none" },
                    "-ms-overflow-style": "none",
                    "scrollbar-width": "none",
                  }}
                >
                  {announcements.map((announcement) => (
                    <Box key={announcement._id} sx={{ marginBottom: 2 }}>
                      <Announcement
                        title={announcement.title}
                        description={announcement.description}
                        timestamp={announcement.formattedTimestamp} // Pass formatted timestamp
                      />
                      {role === 'Admin' && (
                        <IconButton sx={{ fontSize: "1rem" }} onClick={() => removeAnnouncement(announcement._id)} color="secondary">
                          Remove
                        </IconButton>
                      )}
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Layout>
  );
};

export default AnnouncementsPage;

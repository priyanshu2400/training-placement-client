import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import Post from "../components/Post";
import {
  Box,
  Button,
  Card,
  CardContent,
  Fab,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useNavigate } from "react-router-dom";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [uniqueCompanies, setUniqueCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const backendServer =
    process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5000";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${backendServer}/getBlogs`);
        const data = await response.json();

        // Extract unique company names (case-insensitive)
        const uniqueCompaniesSet = new Set();
        data.forEach((blog) => {
          const companyName = blog.company.toLowerCase(); // Normalize to lowercase
          uniqueCompaniesSet.add(companyName);
        });

        // Convert Set back to Array
        const uniqueCompanies = Array.from(uniqueCompaniesSet);
        setUniqueCompanies(uniqueCompanies);

        setBlogs(data); // Set blogs state
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, [backendServer]);

  const handleCompanyClick = (company) => {
    setSelectedCompany(company === selectedCompany ? null : company);
  };

  const filteredBlogs = selectedCompany
    ? blogs.filter(
        (blog) => blog.company.toLowerCase() === selectedCompany.toLowerCase()
      )
    : blogs;

  return (
    <Layout>
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>
          Blog Page
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", padding: 2 }}>
        {/* Company Cards Section */}
        <Card
          sx={{
            minWidth: 200,
            maxWidth: 300,
            padding: 4,
            marginTop: 5,
            marginLeft: 5,
            marginRight: 5,
            height: "fit-content",
            backgroundColor: "white",
            boxShadow: 3,
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                margin: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Companies
            </Typography>
            {uniqueCompanies.map((company) => (
              <Button
                key={company}
                variant={
                  company.toLowerCase() === selectedCompany?.toLowerCase()
                    ? "contained"
                    : "outlined"
                }
                onClick={() => handleCompanyClick(company)}
                fullWidth
                sx={{
                  marginBottom: 1,
                  textTransform: "capitalize",
                  borderColor: "#1976d2",
                  '&:hover': {
                    backgroundColor: "#1976d2",
                    color: "white",
                  }
                }}
              >
                {company}
              </Button>
            ))}
          </CardContent>
        </Card>
        {/* Blogs Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            padding: 3,
            margin: 1,
            backgroundColor: "#f4f6f8",
            borderRadius: 1,
            boxShadow: 3,
          }}
        >
          {filteredBlogs.map((blog) => (
            <Post
              key={blog._id}
              author={blog.name}
              company={blog.company}
              content={blog.text}
              createdAt={blog.createdAt} // Pass createdAt to Post component
              email={blog.email} // Pass email to Post component
              likes={<ThumbUpIcon />}
            />
          ))}
          <Box sx={{ position: "fixed", bottom: "16px", right: "16px" }}>
            <Fab
              color="primary"
              aria-label="add blog"
              onClick={() => navigate("/addBlog")}
            >
              <AddIcon />
            </Fab>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default BlogPage;

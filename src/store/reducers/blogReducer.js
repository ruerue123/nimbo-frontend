import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// Get all blogs with pagination
export const get_blogs = createAsyncThunk(
    'blog/get_blogs',
    async ({ page, parPage, category, searchValue }, { fulfillWithValue, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/home/blogs?page=${page}&parPage=${parPage}&category=${category || 'all'}&searchValue=${searchValue || ''}`)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data)
        }
    }
)

// Get featured blogs
export const get_featured_blogs = createAsyncThunk(
    'blog/get_featured_blogs',
    async (_, { fulfillWithValue, rejectWithValue }) => {
        try {
            const { data } = await api.get('/home/blogs/featured')
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data)
        }
    }
)

// Get latest blogs for homepage
export const get_latest_blogs = createAsyncThunk(
    'blog/get_latest_blogs',
    async (_, { fulfillWithValue, rejectWithValue }) => {
        try {
            const { data } = await api.get('/home/blogs/latest')
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data)
        }
    }
)

// Get single blog by slug
export const get_blog = createAsyncThunk(
    'blog/get_blog',
    async (slug, { fulfillWithValue, rejectWithValue }) => {
        try {
            const { data } = await api.get(`/home/blog/${slug}`)
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data)
        }
    }
)

export const blogReducer = createSlice({
    name: 'blog',
    initialState: {
        blogs: [],
        featuredBlogs: [],
        latestBlogs: [],
        blog: null,
        relatedBlogs: [],
        totalBlogs: 0,
        loader: false,
        errorMessage: ''
    },
    reducers: {
        clearBlog: (state) => {
            state.blog = null
            state.relatedBlogs = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_blogs.pending, (state) => {
                state.loader = true
            })
            .addCase(get_blogs.fulfilled, (state, { payload }) => {
                state.loader = false
                state.blogs = payload.blogs
                state.totalBlogs = payload.totalBlogs
            })
            .addCase(get_blogs.rejected, (state, { payload }) => {
                state.loader = false
                state.errorMessage = payload?.error || 'Failed to load blogs'
            })

            .addCase(get_featured_blogs.fulfilled, (state, { payload }) => {
                state.featuredBlogs = payload.blogs
            })

            .addCase(get_latest_blogs.fulfilled, (state, { payload }) => {
                state.latestBlogs = payload.blogs
            })

            .addCase(get_blog.pending, (state) => {
                state.loader = true
            })
            .addCase(get_blog.fulfilled, (state, { payload }) => {
                state.loader = false
                state.blog = payload.blog
                state.relatedBlogs = payload.relatedBlogs
            })
            .addCase(get_blog.rejected, (state, { payload }) => {
                state.loader = false
                state.errorMessage = payload?.error || 'Failed to load blog'
            })
    }
})

export const { clearBlog } = blogReducer.actions
export default blogReducer.reducer

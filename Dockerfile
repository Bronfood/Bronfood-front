FROM node:20-alpine AS builder

ARG VITE_YNDX_API_KEY
ENV VITE_YNDX_API_KEY=${VITE_YNDX_API_KEY}

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

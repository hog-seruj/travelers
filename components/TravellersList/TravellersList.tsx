'use client';
import { User } from '@/types/user';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import axios from 'axios';

export interface fetchTravellersResponse {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  users: User[];
}

async function fetchTravellers(): Promise<fetchTravellersResponse> {
  const { data } = await axios.get<fetchTravellersResponse>('/users');
  return data;
}

function TravellersList() {
  return (
    <>
      <div>
        <ul>
          <li>
            <h3>{}</h3>
            <p>{}</p>
            <Link href={`travellers/[travallerId`}>Переглянути профіль</Link>
          </li>
        </ul>
      </div>
    </>
  );
}

export default TravellersList;

'use server';

import DatabaseService from "./database";
import { Contract, NewContract } from "./definitions";

const dbService = new DatabaseService();

export async function insertContractApi(address: string, contract: NewContract) {
    return dbService.insertContract(address, contract);
}

export async function depositApi(address: string, depositAmount: bigint) {
    return dbService.deposit(address, depositAmount);
}

export async function getContractPagesApi(owner: string, query: string) {
    return dbService.getContractPages(owner, query);
}

export async function getContractByAddressApi(owner: string) {
    return dbService.getContractByAddress(owner);
}

export async function getFilteredContractsApi(
    owner: string, 
    query: string, 
    currentPage: number
) {
    return dbService.getFilteredContracts(owner, query, currentPage);
}

export async function getAllContractsApi() {
    return dbService.getAllContracts();
}
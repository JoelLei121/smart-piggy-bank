'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { NewContract } from './definitions';
import { parseUnits } from "ethers";
import { insertContractApi, depositApi } from './data';


// TODO: timestamp > current
const CreateFormSchema = z.object({
  owner: z.string({
    invalid_type_error: 'Please enter a wallet address.',
  }),
  type: z.enum(['money', 'time'], {
    invalid_type_error: 'Please select a contract type.',
  }),
  timestamp: z.string()
    .min(1, "Date is required")
    .transform((val) => new Date(val)),
  targetAmount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  currentAmount: z.coerce
    .number()
    .gte(0, { message: 'Please enter an amount greater than or equal to $0.' }),
});

const CreateContract = CreateFormSchema.omit({ targetAmount: true, timestamp: true });

export type CreateState = {
  errors?: {
    owner?: string[];
    type?: string[];
    timestamp?: string[];
    targetAmount?: string[];
    currentAmount?: string[];
  };
  message?: string | null;
};

export async function createContract(prevState: CreateState, formData: FormData) {
  // 1. validate formData
  console.log(formData);
  const validatedFields = CreateContract.safeParse({
    owner: formData.get('owner'),
    type: formData.get('type'),
    currentAmount: formData.get('currentAmount'),
  });
  if (!validatedFields.success) {
    console.log(validatedFields);
    revalidatePath('/dashboard/contracts/create');
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Contract.',
    };
  }
  const { owner, type, currentAmount } = validatedFields.data;
  const newContract: NewContract = {
    owner: owner, 
    type: type, 
    currentAmount: parseUnits(currentAmount.toString(), 'ether'),
    timestamp: undefined,
    targetAmount: undefined, 
  }

  // select time or money
  if (type === "time") {
    const CreateContractOption = CreateFormSchema.pick({ timestamp: true });
    const validatedTimestamp = CreateContractOption.safeParse({
      timestamp: formData.get('timestamp')
    });
    if (!validatedTimestamp.success) {
      console.log(validatedTimestamp);
      revalidatePath('/dashboard/contracts/create');
      return {
        errors: validatedTimestamp.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Contract.',
      };
    }
    const { timestamp } = validatedTimestamp.data;

    newContract.timestamp = timestamp.toISOString();
  } else {
    const CreateContractOption = CreateFormSchema.pick({ targetAmount: true });
    const validatedTargetAmount = CreateContractOption.safeParse({
      targetAmount: formData.get('targetAmount')
    });
    if (!validatedTargetAmount.success) {
      console.log(validatedTargetAmount);
      revalidatePath('/dashboard/contracts/create');
      return {
        errors: validatedTargetAmount.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Contract.',
      };
    }
    const { targetAmount } = validatedTargetAmount.data;
    newContract.targetAmount = parseUnits(targetAmount.toString(), 'ether');
  }

  // 2. publish contract by signer
  console.log(newContract);
  const address = Date.now().toString();

  // 3. update result to database
  try {
    await insertContractApi(address, newContract);
  } catch (error) {
    console.log(error);
    return {
      message: 'Database Error: Failed to Create Contract.',
    };
  }
 
  revalidatePath('/dashboard/contracts');
  redirect('/dashboard/contracts');
}


const DepositFormSchema = z.object({
  address: z.string(),
  owner: z.string(),
  currentAmount: z.coerce.number(),
  depositAmount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
});

const Deposit = DepositFormSchema.pick({ depositAmount: true });

export type DepositState = {
  errors?: {
    depositAmount?: string[];
  };
  message?: string | null;
};

export async function deposit(
  address: string, 
  prevState: DepositState,
  formData: FormData
) {
  const validatedFields = Deposit.safeParse({
    depositAmount: formData.get('depositAmount'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Deposit.',
    };
  }
 
  const { depositAmount } = validatedFields.data;

  try {
    await depositApi(address, parseUnits(depositAmount.toString(), 'ether'));
  } catch (error) {
    console.log(error);
    return {
      message: 'Database Error: Failed to Create Contract.',
    };
  };

  revalidatePath('/dashboard/contracts');
  redirect('/dashboard/contracts');
}

export async function deleteContract(address: string) {
  revalidatePath('/dashboard/contracts');
};

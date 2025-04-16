'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { NewContract } from './definitions';
import { parseUnits } from "ethers";
import { insertContractApi, depositApi, deleteContractApi } from './data';


const CreateFormSchema = z.object({
  address: z.string(),
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
  // console.log(formData);
  const validatedFields = CreateContract.safeParse({
    address: formData.get('address'),
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
  const { address, owner, type, currentAmount } = validatedFields.data;
  const newContract: NewContract = {
    owner: owner, 
    type: type, 
    currentAmount: parseUnits(currentAmount.toString(), 'ether'),
    timestamp: undefined,
    targetAmount: undefined, 
  }

  // select time or money
  if (type === "time") {
    // by time
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
    newContract.timestamp = (timestamp.getTime() / 1000).toString();
  } else {
    // by money
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
  totalAmount: z.coerce.number(),
});

const Deposit = DepositFormSchema.pick({ totalAmount: true, depositAmount: true });

export type DepositState = {
  errors?: {
    depositAmount?: string[];
  };
  message?: string | null;
};

export async function deposit(
  prevState: DepositState,
  formData: FormData,
  address: string
) {
  const validatedFields = Deposit.safeParse({
    depositAmount: formData.get('depositAmount'),
    totalAmount: formData.get('totalAmount'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Deposit.',
    };
  }
 
  const totalAmount = parseUnits(validatedFields.data.totalAmount.toString(), 'wei');

  try {
    await depositApi(address, totalAmount);
  } catch (error) {
    console.log(error);
    return {
      message: 'Database Error: Failed to Deposit.',
    };
  };

  revalidatePath('/dashboard/contracts');
  redirect('/dashboard/contracts');
};



const WithdrawFormSchema = z.object({
  address: z.string(),
  owner: z.string(),
  currentAmount: z.coerce.number(),
});

const Withdraw = WithdrawFormSchema;

export type WithdrawState = {
  message?: string | null;
};

export async function withdraw(
  prevState: DepositState,
  formData: FormData
) {
  const validatedFields = Withdraw.safeParse({
    address: formData.get('address'),
    owner: formData.get('owner'),
    currentAmount: formData.get('currentAmount'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Missing Fields. Failed to Withdraw.',
    };
  }
 
  const { address, owner, currentAmount } = validatedFields.data;

  try {
    await deleteContractApi(address);
  } catch (error) {
    console.log(error);
    return {
      message: 'Database Error: Failed to Delete Contract.',
    };
  };

  revalidatePath('/dashboard/contracts');
  redirect('/dashboard/contracts');
};


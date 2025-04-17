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
  unlockTimestamp: z.string()
    .min(1, "Date is required")
    .transform((val) => new Date(val)),
  targetAmount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  currentAmount: z.coerce
    .number()
    .gte(0, { message: 'Please enter an amount greater than or equal to $0.' }),
});

const CreateContract = CreateFormSchema.omit({ targetAmount: true, unlockTimestamp: true });

export type CreateState = {
  errors?: {
    owner?: string[];
    type?: string[];
    unlockTimestamp?: string[];
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
    unlockTimestamp: undefined,
    targetAmount: undefined, 
  }

  // select time or money
  if (type === "time") {
    // by time
    const CreateContractOption = CreateFormSchema.pick({ unlockTimestamp: true });
    const validatedTimestamp = CreateContractOption.safeParse({
      unlockTimestamp: formData.get('unlockTimestamp')
    });
    if (!validatedTimestamp.success) {
      console.log(validatedTimestamp);
      revalidatePath('/dashboard/contracts/create');
      return {
        errors: validatedTimestamp.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Contract.',
      };
    }
    const { unlockTimestamp } = validatedTimestamp.data;
    newContract.unlockTimestamp = (unlockTimestamp.getTime() / 1000).toString();
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
});

const Deposit = DepositFormSchema.pick({ address: true, currentAmount: true, depositAmount: true });

export type DepositState = {
  errors?: {
    depositAmount?: string[];
  };
  message?: string | null;
};

export async function deposit(
  prevState: DepositState,
  formData: FormData
) {
  const validatedFields = Deposit.safeParse({
    address: formData.get('address'),
    currentAmount: formData.get('currentAmount'),
    depositAmount: formData.get('depositAmount'),
  });


  if (!validatedFields.success) {
    console.log(validatedFields);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Deposit.',
    };
  }
 
  const address = validatedFields.data.address;
  const currentAmount = parseUnits(validatedFields.data.currentAmount.toString(), 'ether');
  const depositAmount = parseUnits(validatedFields.data.depositAmount.toString(), 'ether');
  const totalAmount = currentAmount + depositAmount;
  try {
    const result = await depositApi(address, totalAmount);
    console.log(result);
  } catch (error) {
    console.log(error);
    return {
      message: 'Database Error: Failed to Deposit.',
    };
  };
  console.log("redirect");
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


import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  fetchBankAccounts,
  deleteBankAccount,
  toggleBankAccountStatus,
  setDefaultBankAccount,
  addBankAccount,
  updateBankAccount,
} from "@/store/bankSlice";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "../../ui/pagination";

import { Button } from "../../ui/button";
import { FileEditIcon, TrashIcon, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";

import { Switch } from "../../ui/switch";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { useForm } from "react-hook-form";

const BankAccountForm = ({ defaultValues, onClose }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: defaultValues || {
      bankName: "",
      accountHolderName: "",
      accountNumber: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      if (defaultValues?._id) {
        await dispatch(
          updateBankAccount({ id: defaultValues._id, data })
        ).unwrap();
        toast.success("Bank account updated successfully");
      } else {
        await dispatch(addBankAccount(data)).unwrap();
        toast.success("Bank account added successfully");
      }
      reset();
      onClose();
    } catch (error) {
      toast.error("Failed to save bank account");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mx-auto">
      <div>
        <Label htmlFor="bankName">Banque</Label>
        <Input id="bankName" {...register("bankName", { required: true })} />
      </div>
      <div>
        <Label htmlFor="accountHolderName">Titulaire du compte</Label>
        <Input
          id="accountHolderName"
          {...register("accountHolderName", { required: true })}
        />
      </div>
      <div>
        <Label htmlFor="accountNumber">Numéro de compte</Label>
        <Input
          id="accountNumber"
          {...register("accountNumber", { required: true })}
        />
      </div>
      <Button type="submit" className="w-full">
        {defaultValues ? "Modifier le compte bancaire" : "Ajouter un compte bancaire"}
      </Button>
    </form>
  );
};

const BankAccounts = () => {
  const dispatch = useDispatch();
  const { bankAccounts, status, error } = useSelector(
    (state) => state.bankAccounts
  );

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchBankAccounts());
  }, [dispatch]);

  // Handlers for dialog open/close and edit/add
  const openAddDialog = () => {
    setSelectedAccount(null);
    setOpenDialog(true);
  };

  const openEditDialog = (account) => {
    setSelectedAccount(account);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setSelectedAccount(null);
    setOpenDialog(false);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this bank account?"
    );
    if (!confirmed) return;

    try {
      await dispatch(deleteBankAccount(id)).unwrap();
      toast.success("Bank account deleted successfully");
    } catch {
      toast.error("Failed to delete bank account");
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await dispatch(toggleBankAccountStatus(id)).unwrap();
      toast.success("Account status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await dispatch(setDefaultBankAccount(id)).unwrap();
      toast.success("Default account updated");
    } catch {
      toast.error("Failed to update default account");
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = bankAccounts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(bankAccounts.length / itemsPerPage);
  const defaultCount = bankAccounts.filter((acc) => acc.isDefault).length;
  const activeCount = bankAccounts.filter((acc) => acc.isActive).length;

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Comptes bancaires</CardTitle>
            <CardDescription>Gérez vos comptes bancaires liés.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              {/* Add Bank Account button triggers Dialog */}
              <Button onClick={openAddDialog}>
                <Plus className="w-4 h-4 mr-2" /> Ajouter un compte bancaire
              </Button>
            </div>

            {status === "loading" && <p>Loading...</p>}
            {error && <p className="text-red-600">Error: {error}</p>}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Banque</TableHead>
                  <TableHead>Titulaire du compte</TableHead>
                  <TableHead>Numéro de compte</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Par défaut</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((acc) => (
                  <TableRow key={acc._id}>
                    <TableCell>{acc.bankName}</TableCell>
                    <TableCell>{acc.accountHolderName}</TableCell>
                    <TableCell>{acc.accountNumber}</TableCell>
                    <TableCell>
                      <Switch
                        checked={acc.isActive}
                        onCheckedChange={() => handleToggleActive(acc._id)}
                        disabled={acc.isActive && activeCount === 1}
                      />
                    </TableCell>

                    <TableCell>
                      <Switch
                        checked={acc.isDefault}
                        onCheckedChange={() => handleSetDefault(acc._id)}
                        disabled={acc.isDefault && defaultCount === 1}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(acc)}
                        >
                          <FileEditIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(acc._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {currentItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No bank accounts found.
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(currentPage - 1)}
                        />
                      </PaginationItem>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(currentPage + 1)}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog for Add/Edit */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedAccount ? "Modifier le compte bancaire" : "Ajouter un compte bancaire"}
            </DialogTitle>
          </DialogHeader>

          <BankAccountForm
            defaultValues={selectedAccount}
            onClose={closeDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BankAccounts;

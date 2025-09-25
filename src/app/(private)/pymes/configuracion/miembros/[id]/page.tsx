"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { PATHROUTES } from "@/constants/pathroutes";
import { useMembers } from "@/context/MembersContext";

interface Member {
  id: string;
  userId: string;
  role: "OWNER" | "EMPLOYEE" | "ADMIN";
  user: {
    name: string;
    email: string;
    image?: string | null;
    isActive: boolean;
  };
}

const roles = [
  { value: "ADMIN", label: "Administración" },
  { value: "EMPLOYEE", label: "Empleado" },
];

export default function EditarMiembroPage() {
  const params = useParams();
  const router = useRouter();
  const memberId = useMemo(() => (typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : ""), [params]);
  const { members, isLoading, fetchMembers, updateMemberRole, updateMemberDetails } = useMembers();
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    const ensureData = async () => {
      try {
        if (!members.length) {
          await fetchMembers();
        }
        const found = (prevList?: Member[]) => {
          const list = prevList ?? members;
          return list.find((m) => m.id === memberId) || null;
        };
        setMember(found());
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Error desconocido.");
      }
    };
    if (memberId) void ensureData();
  }, [memberId, members, fetchMembers]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: member?.user.name || "",
      email: member?.user.email || "",
      role: member?.role === "OWNER" ? "ADMIN" : member?.role || "EMPLOYEE",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("El nombre es requerido"),
      email: Yup.string().email("Email no válido").required("El email es requerido"),
      role: Yup.string().oneOf(["ADMIN", "EMPLOYEE"], "Rol inválido").required("El rol es requerido"),
    }),
    onSubmit: async (values) => {
      if (!member) return;
      try {
        const updates: Promise<unknown>[] = [];
        if (values.role !== (member.role === "OWNER" ? "ADMIN" : member.role)) {
          updates.push(updateMemberRole(member.userId, values.role));
        }
        if (values.name !== member.user.name || values.email !== member.user.email) {
          updates.push(updateMemberDetails(member.userId, { name: values.name, email: values.email }));
        }
        if (!updates.length) {
          toast("No hay cambios para guardar.");
          return;
        }
        await Promise.all(updates);
        toast.success("Miembro actualizado correctamente");
        router.push(PATHROUTES.pymes.miembros);
      } catch (error) {
        console.error("Error al actualizar miembro:", error);
        toast.error(error instanceof Error ? error.message : "No se pudo actualizar el miembro");
      }
    },
  });

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href={PATHROUTES.pymes.miembros}>
          <Button variant="outline" className="px-3">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Editar Miembro</h1>
      </div>

      <Card isClickable={false}>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : !member ? (
          <div className="p-4 text-center text-foreground/60">No se encontró el miembro.</div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input id="name" label="Nombre" {...formik.getFieldProps("name")} />
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>
                ) : null}
              </div>
              <div>
                <Input id="email" label="Email" type="email" {...formik.getFieldProps("email")} />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                ) : null}
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-foreground/80 mb-2">
                  Rol
                </label>
                <select
                  id="role"
                  {...formik.getFieldProps("role")}
                  className="w-full px-4 py-3 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                {formik.touched.role && formik.errors.role ? (
                  <div className="text-red-500 text-xs mt-1">{formik.errors.role}</div>
                ) : null}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit">Guardar Cambios</Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}

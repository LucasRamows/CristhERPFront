import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "../../components/ui/field";
import { useData } from "../../contexts/DataContext";
import loginForm from "../schemas/loginFormSchema";

import { Button } from "../../components/ui/button";

import { Input } from "../../components/ui/input";
import { cn } from "../../lib/utils";
import { authService } from "../../services/user/auth.service";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const { refreshData } = useData();

  const form = useForm<z.infer<typeof loginForm>>({
    resolver: zodResolver(loginForm),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginForm>) => {
    try {
      await authService.login({
        email: values.email,
        password: values.password,
      });

      await refreshData();
      navigate("/root/dashboard");
    } catch (err: any) {
      console.error("Erro no login:", err.response?.data || err.message);
      alert("Credenciais inválidas ou erro no servidor.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-8 items-center justify-center rounded-md">
              <img src="/logo.svg" alt="Logo"/>
            </div>

            <h1 className="text-xl font-bold">Bem-vindo(a) ao Cristh ERP</h1>
          </div>

          {/* EMAIL */}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@email.com"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </Field>

          {/* PASSWORD */}
          <Field>
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <Input id="password" type="password" {...form.register("password")} />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </Field>

          {/* SUBMIT */}
          <Field>
            <Button type="submit">Login</Button>
          </Field>
        </FieldGroup>
      </form>

      <FieldDescription className="px-6 text-center">
        Ao prosseguir, você concorda com nossos <a href="#">Termos de Uso</a> e{" "}
        <a href="#">Política de Privacidade</a>.
      </FieldDescription>
    </div>
  );
}

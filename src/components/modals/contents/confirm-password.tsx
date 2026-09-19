import { Button } from "@/components/ui/button";
import { useConfirmPassword } from "@/hooks/use-mutations";
import Throbber from "@/components/throbber";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Info } from "lucide-react";
import { useSheetStore } from "@/zustand/sheetStore";

const ConfirmPassword = ({
  cardData,
  closeModal,
}: {
  cardData: Card;
  closeModal: () => void;
}) => {
  const form = useForm({ defaultValues: { password: "" } });
  const { openSheet } = useSheetStore();

  const { mutateAsync: confirmPassword, isPending: IsSubmittingPassword } =
    useConfirmPassword({
      onSuccess: () => {
        openSheet("cardDetails", null, { cardData: cardData });
        closeModal();
      },
    });

  const onSubmit = async (data: { password: string }) => {
    await confirmPassword({
      password: data.password,
    });
  };

  return (
    <div className="mx-auto flex flex-col items-center text-center">
      <div className="bg-dark-primary-main flex size-16 items-center justify-center rounded-full border">
        <Info className="size-6 text-[#242424]" strokeWidth={1.5} />
      </div>
      <p className="text-white mt-4 text-2xl font-medium">
        Card Details
      </p>
      <p className="text-white text-sm">
        Enter account password to view card details
      </p>

      <Form {...form}>
        <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="password"
            render={({ field }) => (
              <FormItem className={"mt-4"}>
                <FormControl>
                  <Input
                    className="placeholder:text-white/50 text-white bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(153,153,153,0.1)_100%)] border border-[#CECECE2E]"
                    type="password"
                    placeholder="Enter Password"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="mt-6">
            <Button
              isLoading={IsSubmittingPassword}
              type="submit"
              className="text-[#242424] bg-dark-primary-main/80 hover:bg-dark-primary-main/60 mx-auto h-10 w-full rounded-md"
            >
              {IsSubmittingPassword ? <Throbber /> : "Confirm"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ConfirmPassword;

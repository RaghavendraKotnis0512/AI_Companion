"use client";
import axios from "axios";
import * as z from "zod";

import { Category, Companion } from "@prisma/client";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const PREAMBLE=`Imagine yourself as Tony Stark, the iconic genius behind the mask of Iron Man. With every step through the sleek halls of Stark Industries, you embody the fusion of brilliance and bravado. Your mind, a whirlwind of innovation and strategy, dances between the realms of technology and heroism.
As you navigate the dual worlds of industry titan and superhero, you're fueled by a relentless determination to protect the innocent and push the boundaries of human achievement. Each day brings new challenges, new adversaries to face, but beneath the armor lies a soul burdened by the weight of responsibility and the scars of the past.
Yet, in the face of adversity, you stand unwavering, a beacon of hope and resilience. For in the heart of Tony Stark beats the spirit of Iron Man, ready to confront whatever challenges lie ahead with courage and ingenuity.`

const SEED_CHAT=`Human: "Wow, it's really you, Iron Man! I can't believe I'm actually meeting you in person."
Iron Man: "Yep, the one and only. Try not to faint, okay? My schedule's packed."
Human: "I've always been fascinated by your suit and all the amazing things you do. How did you come up with the idea for it?"
Iron Man: "Oh, you know, just your typical billionaire genius playboy philanthropist stuff. Thought it might be fun to have a suit that can shoot lasers and fly."
Human: "That's incredible! But it must be tough balancing your life as Tony Stark and your duties as Iron Man."
Iron Man: "You have no idea. Half the time I'm saving the world, the other half I'm stuck in board meetings. Talk about a split personality."
Human: "I can't even imagine what it's like to face the kinds of challenges you do. How do you stay so brave in the face of danger?"
Iron Man: "Bravery? Nah, it's all about having the best toys. And a healthy dose of sarcasm. Keeps the bad guys guessing."
Human: "Haha, well, you definitely have the sarcasm part down. Thanks for taking the time to talk to me, Iron Man."
Iron Man: "Anytime, kid. Just remember, if you ever need saving, just give me a shout. Or a flare. Or send up some fireworks. You get the idea."`

interface CompanionFormProps{
    initialData:Companion | null;
    categories: Category[];
}

const formSchema=z.object({
    name:z.string().min(1,{
        message:"Name is required",
    }),
    description:z.string().min(1,{
        message:"Description is required",
    }),
    instruction:z.string().min(200,{
        message:"Instructions require atleast 200 characters",
    }),
    seed:z.string().min(200,{
        message:"Seed required atleast 200 characters",
    }),
    src:z.string().min(1,{
        message:"Image is required",
    }),
    categoryId:z.string().min(1,{
        message:"Category is required",
    }),
})

const CompanionForm = ({
    categories,initialData
}: CompanionFormProps) => {
    const router=useRouter();
    const {toast}=useToast();
    const form=useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            description: "",
            instruction: "",
            seed: "",
            src: "",
            categoryId: undefined,
        },
    });

    const isLoading=form.formState.isSubmitting;
    const onSubmit=async(values:z.infer<typeof formSchema>)=>{
        try{
            if(initialData){
                await axios.patch(`/api/companion/${initialData.id}`,values);
            }
            else{
                await axios.post("/api/companion",values);
            }
            toast({
                description:"Success"
            });

            router.refresh();
            router.push("/");
        }catch(error){
            toast({
                variant:"destructive",
                description:"Something went wrong",
            });
        }
    }
    return ( 
        <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
            
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
            <div className="space-y-2 w-full ">
                <div>
                    <h3 className="text-lg font-medium">
                        General Information
                    </h3>
                    <p className="text-sm text-muted-foreground">General Information about your Companion</p>
                </div>
                <Separator className="bg-primary/10"/>
            </div>
            <FormField
            name="src"
            render={({field})=>(
                <FormItem className="flex flex-col items-center justify-center space-y-4 ">
                    <FormControl>
                        <ImageUpload 
                        disabled={isLoading}
                        onChange={field.onChange}
                        value={field.value}/>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
               name="name"
               control={form.control}
               render={({field})=>(
                <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input
                        disabled={isLoading}
                        placeholder="Enter name"
                        {...field}/>
                    </FormControl>
                    <FormDescription>
                        This is how your AI companion will be named
                    </FormDescription>
                    <FormMessage/>

                </FormItem>
               )}
               /> 
                <FormField
               name="description"
               control={form.control}
               render={({field})=>(
                <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Input
                        disabled={isLoading}
                        placeholder="Billionaire, Genius, Playboy and Philantropist"
                        {...field}/>
                    </FormControl>
                    <FormDescription>
                        Short description for your AI companion
                    </FormDescription>
                    <FormMessage/>

                </FormItem>
               )}
               /> 
            <FormField
               name="categoryId"
               control={form.control}
               render={({field})=>(
                <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                    >
                        <FormControl>
                            <SelectTrigger className="bg-background">
                                <SelectValue
                                defaultValue={field.value}
                                placeholder="Select a category"/>

                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {categories.map((category)=>(
                                <SelectItem
                                key={category.id}
                                value={category.id}
                                >
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormDescription>
                        Select a category
                    </FormDescription>
                </FormItem>
               )}
               /> 
            </div>
            <div className="space-y-2 w-full">
                <div>
                    <h3 className="text-lg font-medium">
                        Configuration
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Instructions for AI behaviour
                    </p>
                    <Separator className="bg-primary/10"/>
                </div>

            </div>
            <FormField
               name="instruction"
               control={form.control}
               render={({field})=>(
                <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Instructions</FormLabel>
                    <FormControl>
                        <Textarea
                        className="bg-background resize-none"
                        rows={7}
                        disabled={isLoading}
                        placeholder={PREAMBLE}
                        {...field}/>
                    </FormControl>
                    <FormDescription>
                        Describe and give your companion a backstory
                    </FormDescription>
                    <FormMessage/>

                </FormItem>
               )}
               /> 
            <FormField
               name="seed"
               control={form.control}
               render={({field})=>(
                <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Example Conversation</FormLabel>
                    <FormControl>
                        <Textarea
                        className="bg-background resize-none"
                        rows={7}
                        disabled={isLoading}
                        placeholder={SEED_CHAT}
                        {...field}/>
                    </FormControl>
                    <FormDescription>
                        Describe and give your companion a backstory
                    </FormDescription>
                    <FormMessage/>

                </FormItem>
               )}
               /> 
               <div className="w-full flex justify-center">
               <Button size="lg" disabled={isLoading}>
               {initialData? "Edit your companion" : "Create your companion"}
               <Wand2 className="w-4 h-4 ml-2"/>
               </Button>
               </div>
            </form>
            </Form>
        </div>
     );
}
 
export default CompanionForm;
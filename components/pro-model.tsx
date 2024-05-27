"use client";

import { useProModel } from "@/hooks/use-pro-model";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";

export const ProModel=()=>{
    const proModel=useProModel();
    const {toast}=useToast();
    
    const [loading, setLoading]=useState(false);
    const[isMounted, setIsMounted]=useState(false);

    useEffect(()=>{
        setIsMounted(true);
    },[])

    if(!isMounted){
        return null;
    }

    const onSubscribe=async()=>{
        try{
            setLoading(true);

            const response=await axios.get("/api/stripe");

            window.location.href=response.data.url;
        }catch(error){
            toast({
                variant:"destructive",
                description:"Something went wrong"
            })
        }
        finally{
            setLoading(false);
        }
    }

    return(
        <div>
        <Dialog open={proModel.isOpen} onOpenChange={proModel.onClose}>
            <DialogContent>
                <DialogHeader className="space-y-4">
                    <DialogTitle className="text-center">
                        Upgrade to Pro
                    </DialogTitle>
                <DialogDescription className="text-center space-y-2">
                Create <span className="text-sky-500 mx-1 font-medium">Custom AI</span> Companions!
                </DialogDescription>
                </DialogHeader>
                <Separator/>
                <div className="flex justify-between">
                    <p>
                    ₹0
                    <span>
                        .99/ mo
                    </span>
                    </p>
                    <Button disabled={loading} onClick={onSubscribe} variant="premium">
                        Subscribe 
                    </Button>
                </div>
            </DialogContent>

        </Dialog>
        </div>
    )
}
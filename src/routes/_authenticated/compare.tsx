import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, BarChart4, Check, Info, FileText, ChevronRight } from "lucide-react";
import { AppLayout, PageHeader } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  Legend, CartesianGrid
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/compare")({
  head: () => ({ meta: [{ title: "Fabric Comparison — ThreadCounty" }] }),
  component: ComparePage,
});

function ComparePage() {
  const { user } = useAuth();
  const [idA, setIdA] = useState<string>("");
  const [idB, setIdB] = useState<string>("");
  const [imgUrlA, setImgUrlA] = useState<string | null>(null);
  const [imgUrlB, setImgUrlB] = useState<string | null>(null);

  // Fetch all reports
  const { data: reports = [], isLoading } = useQuery({
    enabled: !!user,
    queryKey: ["compare_reports_list", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*, upload:uploads(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const rA = reports.find((r) => r.id === idA);
  const rB = reports.find((r) => r.id === idB);

  // Fetch signed images
  useEffect(() => {
    if (rA?.upload?.storage_path) {
      supabase.storage
        .from("fabric-images")
        .createSignedUrl(rA.upload.storage_path, 3600)
        .then(({ data }) => setImgUrlA(data?.signedUrl ?? null));
    } else {
      setImgUrlA(null);
    }
  }, [rA]);

  useEffect(() => {
    if (rB?.upload?.storage_path) {
      supabase.storage
        .from("fabric-images")
        .createSignedUrl(rB.upload.storage_path, 3600)
        .then(({ data }) => setImgUrlB(data?.signedUrl ?? null));
    } else {
      setImgUrlB(null);
    }
  }, [rB]);

  // Chart data
  const densityChartData = rA && rB ? [
    {
      name: "Total Density (TPI)",
      [rA.fabric_type || "Fabric A"]: Number(rA.thread_density || 0),
      [rB.fabric_type || "Fabric B"]: Number(rB.thread_density || 0),
    },
    {
      name: "Warp Count (/cm)",
      [rA.fabric_type || "Fabric A"]: Number(rA.warp_count || 0),
      [rB.fabric_type || "Fabric B"]: Number(rB.warp_count || 0),
    },
    {
      name: "Weft Count (/cm)",
      [rA.fabric_type || "Fabric A"]: Number(rA.weft_count || 0),
      [rB.fabric_type || "Fabric B"]: Number(rB.weft_count || 0),
    }
  ] : [];

  return (
    <AppLayout>
      <PageHeader
        eyebrow="Instruments"
        title="Fabric Comparison Tool"
        description="Select two scans from your archive to contrast weave structures, count ratios, and densities."
      />

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Selector A */}
        <div className="space-y-2">
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Select Fabric A</label>
          <Select value={idA} onValueChange={setIdA}>
            <SelectTrigger className="w-full rounded-sm h-11 bg-card border-border text-xs">
              <SelectValue placeholder="Choose fabric scan A" />
            </SelectTrigger>
            <SelectContent>
              {reports.map((r) => (
                <SelectItem key={r.id} value={r.id} className="text-xs">
                  {r.fabric_type || "Untitled scan"} ({new Date(r.created_at).toLocaleDateString()}) - {r.thread_density} TPI
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selector B */}
        <div className="space-y-2">
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Select Fabric B</label>
          <Select value={idB} onValueChange={setIdB}>
            <SelectTrigger className="w-full rounded-sm h-11 bg-card border-border text-xs">
              <SelectValue placeholder="Choose fabric scan B" />
            </SelectTrigger>
            <SelectContent>
              {reports.map((r) => (
                <SelectItem key={r.id} value={r.id} className="text-xs">
                  {r.fabric_type || "Untitled scan"} ({new Date(r.created_at).toLocaleDateString()}) - {r.thread_density} TPI
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-muted-foreground">Loading archive logs…</div>
      ) : !rA || !rB ? (
        <div className="py-20 text-center border border-dashed border-border rounded-md bg-card">
          <BarChart4 className="size-12 mx-auto text-muted-foreground animate-pulse mb-3" />
          <h3 className="text-sm font-semibold">Select both fabrics</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto">
            Choose two fabric reports from the dropdown menus above to compare their properties.
          </p>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Side-by-side Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Fabric A Info */}
            <Card className="border-border bg-card overflow-hidden">
              <div className="flex justify-between items-center bg-brand/10 px-6 py-3 border-b border-border">
                <Badge className="bg-brand text-brand-foreground rounded-sm font-mono text-[10px] uppercase">Fabric A</Badge>
              </div>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{rA.fabric_type || "Untitled scan"}</h3>
                  <p className="text-xs text-muted-foreground font-mono">Scan ID: {rA.id.slice(0, 8)}...</p>
                </div>
                <dl className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-xs">
                  <div>
                    <dt className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Weave Pattern</dt>
                    <dd className="mt-1 font-semibold text-sm">{rA.weave_pattern || "—"}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Thread Density</dt>
                    <dd className="mt-1 font-semibold text-sm text-brand">{rA.thread_density ?? "—"} TPI</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Warp Count</dt>
                    <dd className="mt-1 font-semibold text-sm">{rA.warp_count ?? "—"} /cm</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Weft Count</dt>
                    <dd className="mt-1 font-semibold text-sm">{rA.weft_count ?? "—"} /cm</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Confidence Score</dt>
                    <dd className="mt-1 font-semibold text-sm">
                      {rA.confidence_score != null ? `${(Number(rA.confidence_score) * 100).toFixed(1)}%` : "—"}
                    </dd>
                  </div>
                </dl>
                <Button asChild size="sm" className="w-full rounded-sm bg-surface border border-border text-foreground hover:bg-accent mt-2 text-xs">
                  <Link to="/analysis/$id" params={{ id: rA.id }}>View Full Report <ChevronRight className="ml-1 size-3.5" /></Link>
                </Button>
              </CardContent>
            </Card>

            {/* Fabric B Info */}
            <Card className="border-border bg-card overflow-hidden">
              <div className="flex justify-between items-center bg-foreground/5 px-6 py-3 border-b border-border">
                <Badge className="bg-foreground text-background rounded-sm font-mono text-[10px] uppercase">Fabric B</Badge>
              </div>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{rB.fabric_type || "Untitled scan"}</h3>
                  <p className="text-xs text-muted-foreground font-mono">Scan ID: {rB.id.slice(0, 8)}...</p>
                </div>
                <dl className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-xs">
                  <div>
                    <dt className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Weave Pattern</dt>
                    <dd className="mt-1 font-semibold text-sm">{rB.weave_pattern || "—"}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Thread Density</dt>
                    <dd className="mt-1 font-semibold text-sm text-brand">{rB.thread_density ?? "—"} TPI</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Warp Count</dt>
                    <dd className="mt-1 font-semibold text-sm">{rB.warp_count ?? "—"} /cm</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Weft Count</dt>
                    <dd className="mt-1 font-semibold text-sm">{rB.weft_count ?? "—"} /cm</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Confidence Score</dt>
                    <dd className="mt-1 font-semibold text-sm">
                      {rB.confidence_score != null ? `${(Number(rB.confidence_score) * 100).toFixed(1)}%` : "—"}
                    </dd>
                  </div>
                </dl>
                <Button asChild size="sm" className="w-full rounded-sm bg-surface border border-border text-foreground hover:bg-accent mt-2 text-xs">
                  <Link to="/analysis/$id" params={{ id: rB.id }}>View Full Report <ChevronRight className="ml-1 size-3.5" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Comparison Graph */}
          <div className="rounded-md border border-border bg-card p-6">
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">Metrics Comparison</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={densityChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                  <YAxis stroke="#888888" fontSize={11} />
                  <Tooltip contentStyle={{ background: "rgba(30, 30, 30, 0.8)", border: "1px solid #333", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey={rA.fabric_type || "Fabric A"} fill="#7B8C80" radius={[2, 2, 0, 0]} />
                  <Bar dataKey={rB.fabric_type || "Fabric B"} fill="#C8B195" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Variance Analysis */}
          <div className="rounded-md border border-border bg-card p-6">
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">Variance Breakdown</h3>
            <div className="grid gap-4 sm:grid-cols-3 text-xs">
              <div className="rounded-sm border border-border p-4 bg-surface">
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Density Delta</span>
                <div className="mt-2 text-xl font-bold font-mono">
                  {Math.abs(Number(rA.thread_density || 0) - Number(rB.thread_density || 0)).toFixed(1)} TPI
                </div>
                <p className="mt-1 text-muted-foreground text-[10px]">
                  {Number(rA.thread_density || 0) > Number(rB.thread_density || 0)
                    ? `${rA.fabric_type} is denser.`
                    : `${rB.fabric_type} is denser.`}
                </p>
              </div>

              <div className="rounded-sm border border-border p-4 bg-surface">
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Warp/Weft Ratio Delta</span>
                <div className="mt-2 text-xl font-bold font-mono">
                  {Math.abs(
                    (Number(rA.warp_count || 1) / Number(rA.weft_count || 1)) -
                    (Number(rB.warp_count || 1) / Number(rB.weft_count || 1))
                  ).toFixed(2)}
                </div>
                <p className="mt-1 text-muted-foreground text-[10px]">Variance in grain squareness & aspect ratios.</p>
              </div>

              <div className="rounded-sm border border-border p-4 bg-surface">
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Confidence Delta</span>
                <div className="mt-2 text-xl font-bold font-mono">
                  {Math.abs(Number(rA.confidence_score || 0) - Number(rB.confidence_score || 0) * 100).toFixed(1)}%
                </div>
                <p className="mt-1 text-muted-foreground text-[10px]">Difference in computer vision inspection clarity.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

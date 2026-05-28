# Comandos para diagnóstico e "limpeza" de RAM no Windows

> **Aviso importante**: o Windows gerencia RAM automaticamente e mantém cache (standby list) de propósito — isso *parece* memória ocupada mas na verdade acelera o sistema. Limpar esse cache geralmente piora a performance até que ele se reconstrua. Use estes comandos para **diagnóstico** primeiro; só "limpe" quando houver sintoma real (memory leak, sistema travando).

Todos os comandos abaixo devem ser executados em um **PowerShell como Administrador** (clique com botão direito → "Executar como administrador").

---

## 1. Diagnóstico — descobrir o que está consumindo memória

### 1.1. Top 15 processos por uso de memória física

```powershell
Get-Process | Sort-Object WorkingSet64 -Descending |
  Select-Object -First 15 ProcessName, Id,
    @{N='RAM (MB)';E={[math]::Round($_.WorkingSet64/1MB,2)}},
    @{N='Virtual (MB)';E={[math]::Round($_.VirtualMemorySize64/1MB,2)}}
```

**O que faz**: lista os 15 processos que mais ocupam RAM física (WorkingSet) e memória virtual. Útil para identificar o "culpado" antes de qualquer limpeza.

---

### 1.2. Resumo geral da memória do sistema

```powershell
Get-CimInstance Win32_OperatingSystem |
  Select-Object @{N='RAM Total (GB)';E={[math]::Round($_.TotalVisibleMemorySize/1MB,2)}},
                @{N='RAM Livre (GB)';E={[math]::Round($_.FreePhysicalMemory/1MB,2)}},
                @{N='Uso (%)';E={[math]::Round((($_.TotalVisibleMemorySize-$_.FreePhysicalMemory)/$_.TotalVisibleMemorySize)*100,2)}}
```

**O que faz**: mostra RAM total, livre e percentual de uso em GB.

---

### 1.3. Detalhes do contador de performance de memória

```powershell
Get-Counter '\Memory\Available MBytes',
            '\Memory\Cache Bytes',
            '\Memory\Committed Bytes',
            '\Memory\Standby Cache Normal Priority Bytes'
```

**O que faz**: mostra contadores reais do sistema — quanto está disponível, em cache, comprometido (committed) e na standby list. Esses números explicam o que o Gerenciador de Tarefas resume.

---

## 2. Garbage Collection no PowerShell

### 2.1. Forçar GC no processo atual

```powershell
[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()
[System.GC]::Collect()
```

**O que faz**: força o Garbage Collector do .NET a recolher objetos não referenciados **dentro do próprio processo do PowerShell**. Útil se você está rodando scripts longos que acumulam objetos. **Não afeta outros processos do sistema.**

---

## 3. Liberar Working Set de processos (API EmptyWorkingSet)

### 3.1. Reduzir working set de TODOS os processos

```powershell
$sig = @'
[DllImport("psapi.dll")]
public static extern int EmptyWorkingSet(IntPtr hProcess);
'@

$type = Add-Type -MemberDefinition $sig -Name 'Win32EmptyWS' `
                 -Namespace Win32Functions -PassThru

$total = 0
Get-Process | ForEach-Object {
    try {
        $type::EmptyWorkingSet($_.Handle) | Out-Null
        $total++
    } catch { }
}
Write-Host "Working set reduzido em $total processos." -ForegroundColor Green
```

**O que faz**: chama a API `EmptyWorkingSet` para cada processo, empurrando suas páginas de memória para a standby list/page file. O sistema vai recarregar as páginas conforme os processos voltam a precisar delas. **Efeito real é modesto** — apenas reorganiza onde a memória está alocada.

---

### 3.2. Reduzir working set apenas de processos grandes (> 100 MB)

```powershell
$sig = '[DllImport("psapi.dll")] public static extern int EmptyWorkingSet(IntPtr hProcess);'
$type = Add-Type -MemberDefinition $sig -Name 'Win32EmptyWS2' `
                 -Namespace Win32Functions -PassThru

Get-Process | Where-Object { $_.WorkingSet64 -gt 100MB } | ForEach-Object {
    $antes = [math]::Round($_.WorkingSet64/1MB, 2)
    $type::EmptyWorkingSet($_.Handle) | Out-Null
    Start-Sleep -Milliseconds 200
    $proc = Get-Process -Id $_.Id -ErrorAction SilentlyContinue
    if ($proc) {
        $depois = [math]::Round($proc.WorkingSet64/1MB, 2)
        Write-Host "$($_.ProcessName): $antes MB -> $depois MB"
    }
}
```

**O que faz**: faz a mesma coisa, mas só nos processos acima de 100 MB e mostra antes/depois para você ver o efeito.

---

## 4. Limpar Standby List (requer ferramenta externa)

O Windows não expõe API pública para limpar a standby list via PowerShell sem privilégios especiais. Use uma das ferramentas da Microsoft Sysinternals:

### 4.1. EmptyStandbyList.exe (Wen Jia Liu)

Baixe em: <https://wj32.org/wp/software/empty-standby-list/>

```cmd
:: Limpa só a standby list
EmptyStandbyList.exe standbylist

:: Limpa working set de todos os processos
EmptyStandbyList.exe workingsets

:: Limpa modified page list (páginas modificadas que aguardam escrita em disco)
EmptyStandbyList.exe modifiedpagelist

:: Limpa tudo
EmptyStandbyList.exe standbylist workingsets modifiedpagelist
```

**O que faz**: chama APIs internas (`NtSetSystemInformation`) para liberar diferentes pools de memória cacheada. Requer admin.

---

### 4.2. RAMMap (Sysinternals)

Baixe em: <https://learn.microsoft.com/en-us/sysinternals/downloads/rammap>

Modo gráfico — menu **Empty** → opções:

| Opção | O que limpa |
|---|---|
| Empty Working Sets | Working set de todos os processos |
| Empty System Working Set | Working set do kernel |
| Empty Modified Page List | Páginas modificadas pendentes |
| Empty Standby List | Cache em standby (todas as prioridades) |
| Empty Priority 0 Standby List | Apenas cache de baixa prioridade (mais seguro) |

**Recomendação**: se for usar, prefira **"Empty Priority 0 Standby List"** — limpa só o cache que o Windows já considerava descartável.

---

## 5. Comandos auxiliares úteis

### 5.1. Reiniciar Explorer (libera RAM travada na shell)

```powershell
Stop-Process -Name explorer -Force
Start-Process explorer
```

**O que faz**: mata e reinicia o `explorer.exe`. Útil se a barra de tarefas/desktop estiver consumindo memória anormalmente. A tela pisca por 1 segundo.

---

### 5.2. Limpar cache DNS

```powershell
Clear-DnsClientCache
# ou no CMD clássico:
ipconfig /flushdns
```

**O que faz**: limpa o cache de resoluções DNS. Memória negligenciável, mas resolve problemas de rede após mudar `hosts` ou DNS.

---

### 5.3. Limpar arquivos temporários do usuário

```powershell
Remove-Item -Path "$env:TEMP\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "C:\Windows\Temp\*" -Recurse -Force -ErrorAction SilentlyContinue
```

**O que faz**: remove arquivos das pastas TEMP. **Não libera RAM**, mas libera disco — o que indiretamente ajuda em sistemas com pouca memória que dependem do page file.

---

### 5.4. Reiniciar serviço problemático sem reiniciar o PC

```powershell
# Listar top 10 serviços rodando, ordenados por uso de memória do processo
Get-Process | Where-Object { $_.ProcessName -like '*svc*' -or $_.ProcessName -eq 'svchost' } |
  Sort-Object WorkingSet64 -Descending | Select-Object -First 10

# Reiniciar um serviço específico (exemplo: Spooler de impressão)
Restart-Service -Name Spooler -Force
```

---

### 5.5. Matar processos zumbis de um nome específico

```powershell
# Cuidado: lista antes de matar
Get-Process node -ErrorAction SilentlyContinue

# Matar todos os processos com esse nome
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

**O que faz**: útil em ambiente de dev quando processos `node`, `php`, `java` ficam órfãos consumindo RAM. **Substitua `node` pelo nome do processo desejado.**

---

## 6. Script completo de limpeza (use com critério)

Salve como `Limpar-Memoria.ps1` e execute como admin:

```powershell
# Limpar-Memoria.ps1
# Executa: diagnóstico -> GC -> EmptyWorkingSet em processos grandes

Write-Host "`n=== ANTES ===" -ForegroundColor Cyan
Get-CimInstance Win32_OperatingSystem |
  Select-Object @{N='Livre (GB)';E={[math]::Round($_.FreePhysicalMemory/1MB,2)}},
                @{N='Total (GB)';E={[math]::Round($_.TotalVisibleMemorySize/1MB,2)}} |
  Format-Table -AutoSize

Write-Host "Forçando Garbage Collection..." -ForegroundColor Yellow
[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()
[System.GC]::Collect()

Write-Host "Reduzindo working set de processos > 100 MB..." -ForegroundColor Yellow
$sig = '[DllImport("psapi.dll")] public static extern int EmptyWorkingSet(IntPtr hProcess);'
$type = Add-Type -MemberDefinition $sig -Name 'Win32EmptyWS3' `
                 -Namespace Win32Functions -PassThru -ErrorAction SilentlyContinue
if (-not $type) {
    $type = [Win32Functions.Win32EmptyWS3]
}

$count = 0
Get-Process | Where-Object { $_.WorkingSet64 -gt 100MB } | ForEach-Object {
    try { $type::EmptyWorkingSet($_.Handle) | Out-Null; $count++ } catch {}
}
Write-Host "$count processos processados." -ForegroundColor Green

Start-Sleep -Seconds 2

Write-Host "`n=== DEPOIS ===" -ForegroundColor Cyan
Get-CimInstance Win32_OperatingSystem |
  Select-Object @{N='Livre (GB)';E={[math]::Round($_.FreePhysicalMemory/1MB,2)}},
                @{N='Total (GB)';E={[math]::Round($_.TotalVisibleMemorySize/1MB,2)}} |
  Format-Table -AutoSize
```

**Como executar**:

```powershell
# Permitir execução do script (uma vez por sessão)
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Executar
.\Limpar-Memoria.ps1
```

---

## 7. O que **NÃO** existe (mitos comuns)

| Comando | Realidade |
|---|---|
| `cleanmem` no CMD | Não existe nativo |
| `freemem` no PowerShell | Não existe |
| Bat com `mystring="...".freemem()` | Pseudo-script viral, **não funciona** |
| `ipconfig /flushram` | Não existe |
| `sfc /scannow` libera RAM | Falso — é verificação de arquivos do sistema |

---

## Resumo prático

1. **Comece sempre pelo diagnóstico** (seção 1) — geralmente resolve identificando 1 processo problemático.
2. **Para uma "limpeza" real e segura**, o conjunto efetivo é: GC do PowerShell + `EmptyWorkingSet` (seção 3) + `EmptyStandbyList.exe` Priority 0 (seção 4.1).
3. **Reiniciar processos específicos** que vazam memória costuma ser muito mais eficaz do que "limpar RAM".
4. Se você precisa fazer isso com frequência, há um problema subjacente — provavelmente memory leak em algum aplicativo ou driver.
using System;
using System.Diagnostics;
using System.Threading;

namespace AxaGuilDEv.Ecotag.Tests.Server.Datasets;

public class LibreOfficeWorker
	{
		private class Worker
		{
			public string ErrorMessage { get; private set; }
			public Worker(string executablePath, string arguments)
			{
				Process = new Process
				{
					StartInfo = new ProcessStartInfo
					{
						WindowStyle = ProcessWindowStyle.Hidden,
						FileName = executablePath,
						Arguments = arguments
					}
				};
			}
			public void DoWork()
			{
				ErrorMessage = string.Empty;
				try
				{
					using (Process)
					{
						Process.Start();
						Process.WaitForExit();
					}
				}
				catch (Exception e)
				{
					ErrorMessage = e.ToString();
				}
			}
			public Process Process { get; }
		}
		public void DoWork(string executablePath, string arguments, int? timeForWaiting = null)
		{
			var worker = new Worker(executablePath, arguments);
			var thread = new Thread(worker.DoWork)
			{
				IsBackground = true
			};
			thread.Start();

			if (timeForWaiting.HasValue && !thread.Join(TimeSpan.FromSeconds(timeForWaiting.Value)))
			{
				worker.Process.Kill();
				worker.Process.Dispose();
				thread.Abort();
				throw new ConvertDocumentException("LibreOffice process didn't respond within the expected time");
			}

			if (timeForWaiting.HasValue)
				return;

			try
			{
				thread.Join();
			}
			catch (ThreadAbortException)
			{
				worker.Process.Kill();
				worker.Process.Dispose();
				thread.Abort();
				throw;
			}
			catch (Exception)
			{
				if (thread.IsAlive)
					thread.Abort();
			}

			if (!string.IsNullOrEmpty(worker.ErrorMessage))
			{
				throw new ConvertDocumentException($"LibreOffice process error {worker.ErrorMessage}");
			}
		}

	}

public class ConvertDocumentException : Exception
{
	private readonly string _libreofficeProcessDidnTRespondWithinTheExpectedTime;

	public ConvertDocumentException(string libreofficeProcessDidnTRespondWithinTheExpectedTime)
	{
		_libreofficeProcessDidnTRespondWithinTheExpectedTime = libreofficeProcessDidnTRespondWithinTheExpectedTime;
	}
}